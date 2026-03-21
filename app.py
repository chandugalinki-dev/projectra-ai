# Importing Flask class
import os
import json
from flask import Flask, render_template
from flask import request, jsonify
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity


# creating Flask app
app=Flask(__name__)

# Home route i.e,(main page)
@app.route('/')
def home():
    return render_template('home.html')

# Route for projects
@app.route('/projects')
def projects():                    
    return render_template(
        'home.html',page='projects',projects=projects_data) # sedning data to html
    # sending "projects" to html
    # using the same file coz: no seperated files :(

# Degree
@app.route('/degree')
def degree():
    return render_template('home.html',page='degree')

# Career-tips
@app.route('/career-tips')
def career_tips():
    return render_template('home.html',page='career-tips')

# Resources
@app.route('/resources')
def roadmap():
    return render_template('home.html',page='resources')

# Login
@app.route('/signup')
def signup():
    return render_template('home.html',page='signup')

# Recommendation
@app.route('/recommend')
def recommend():
    query=request.args.get('query','').lower()
    print("Query:", query)
    if not query:
        return jsonify([])
    
    # Combining project text
    corpus=[
        p.get("title","") + " " +
        p.get("domain","") + " " +
        p.get("description","") + " " +
        " ".join(p.get("algorithms",[])) + " " +
        " ".join(p.get("tools",[])) + " " +
        " ".join(p.get("roadmap",[]))
        for p in projects_data
    ]

    # Adding user query to corpus
    corpus.append(query)
    # Converting text to vectors to understable by the machine
    vectorizer=TfidfVectorizer()
    vectors=vectorizer.fit_transform(corpus)
    # Computing the similarity
    similarity=cosine_similarity(vectors[-1],vectors[:-1])
    # now Obtaining the top matches...
    scores=list(enumerate(similarity[0]))
    scores=sorted(scores,key=lambda x:x[1],reverse=True)
    # Pickingup the Top5
    top_projects=[projects_data[i] for i, _ in scores[:5]]
    return jsonify(top_projects)

# For individual project page.
@app.route('/project/<int:id>')
def project_detail(id):
    project=None

    for p in projects_data:
        if p["id"]==id:
            project=p
            break

    return render_template("project_detail.html",project=project)


# For server purpose.
BASE = os.path.dirname(__file__)
with open(os.path.join(BASE, 'datasets/aiml_projects.json')) as f:
    aiml = json.load(f)
with open(os.path.join(BASE, 'datasets/datascience_projects.json')) as f:
    ds = json.load(f)
# Combine both
projects_data = aiml + ds

# Lets make--- Recommendation Page
@app.route('/recommendation')
def recommendation_page():
    return render_template('recommend.html')

# Ruuning the server
if __name__=='__main__':
    app.run(debug=True)   # auto_restart server and for showing the errors