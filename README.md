
## Cloning Github Folder into VPS (Using Git Sparse-Checkout)

**1. Initialize a New Git Repository:**  
Create a new directory and initialize a Git repository:  
```
mkdir vehtechs.com  
cd /var/www/vehtechs.com  
git init  
```  
**2. Set Up Sparse Checkout:**  
```
git remote add origin https://github.com/ayazurrehman786/TechWelt.git  
git config core.sparseCheckout true  
```
 
**3. Specify the Folder to Clone:**  
``` 
Create a .git/info/sparse-checkout file and add the paths to the directories you want to clone. For example, if you want to clone Techwelt_FE:  
echo "Techwelt_FE/" >> .git/info/sparse-checkout  
```
  
**4. Pull the Repository:**  
```
git pull origin main  
```  


## Deploy Front-End

```
cd /var/www/vehtechs.com/Techwelt_FE

yarn instal

npm run build
```
Move all files from build directory to vehtechs.com
